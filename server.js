const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Web Server Application Class
 * Implements secure coding practices and modular architecture
 */
class WebServerApp {
  constructor(options = {}) {
    this.port = options.port || process.env.PORT || 3000;
    this.environment = process.env.NODE_ENV || 'development';
    this.app = express();
    
    this.initializeSecurityMiddleware();
    this.initializeBasicMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandlers();
  }

  /**
   * Initialize security middleware
   */
  initializeSecurityMiddleware() {
    // Security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);
  }

  /**
   * Initialize basic middleware
   */
  initializeBasicMiddleware() {
    // Set EJS as the view engine
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'views'));

    // Serve static files
    this.app.use(express.static(path.join(__dirname, 'public')));

    // Body parsing middleware with size limits
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Disable x-powered-by header
    this.app.disable('x-powered-by');
  }

  /**
   * Initialize application routes
   */
  initializeRoutes() {
    const routeHandler = new RouteHandler();
    
    this.app.get('/', routeHandler.renderHome.bind(routeHandler));
    this.app.get('/about', routeHandler.renderAbout.bind(routeHandler));
    this.app.get('/game', routeHandler.renderGame.bind(routeHandler));
  }

  /**
   * Initialize error handlers
   */
  initializeErrorHandlers() {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).render('404', {
        title: '404: Cards Not Found',
        url: this.sanitizeUrl(req.url),
        canonicalUrl: `${req.protocol}://${req.get('host')}/404`
      });
    });

    // Error handler
    this.app.use((err, req, res, next) => {
      console.error(`Error: ${err.message}`, {
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
      });

      res.status(err.status || 500).render('error', {
        title: 'Server Error',
        error: this.environment === 'development' ? err : {},
        canonicalUrl: `${req.protocol}://${req.get('host')}/error`
      });
    });
  }

  /**
   * Sanitize URL to prevent XSS
   * @param {string} url - The URL to sanitize
   * @returns {string} - Sanitized URL
   */
  sanitizeUrl(url) {
    return url.replace(/[<>'"&]/g, (char) => {
      const entities = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[char];
    });
  }

  /**
   * Start the server
   * @returns {Promise<void>}
   */
  async start() {
    try {
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Server running on http://localhost:${this.port}`);
        console.log(`📊 Environment: ${this.environment}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Gracefully stop the server
   * @returns {Promise<void>}
   */
  async stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          console.log('Server stopped gracefully');
          resolve();
        });
      });
    }
  }

  /**
   * Get Express app instance
   * @returns {express.Application}
   */
  getApp() {
    return this.app;
  }
}

/**
 * Route Handler Class
 * Handles all application routes with secure practices
 */
class RouteHandler {
  constructor() {
    this.baseContext = {
      siteName: '404: Cards Not Found',
      siteDescription: 'A card-themed 404 error page project for Hack Club Summer of Making 2025',
      author: 'Thomas Pullan, Mason Bennett & Anna Saunders'
    };
  }

  /**
   * Render home page
   */
  renderHome(req, res) {
    const context = {
      ...this.baseContext,
      title: '404: Cards Not Found',
      message: 'Welcome to 404: Cards Not Found!',
      canonicalUrl: `${req.protocol}://${req.get('host')}/`,
      pageType: 'website'
    };
    res.render('index', context);
  }

  /**
   * Render about page
   */
  renderAbout(req, res) {
    const context = {
      ...this.baseContext,
      title: 'About - 404: Cards Not Found',
      canonicalUrl: `${req.protocol}://${req.get('host')}/about`,
      pageType: 'article'
    };
    res.render('about', context);
  }

  /**
   * Render game page
   */
  renderGame(req, res) {
    const context = {
      ...this.baseContext,
      title: 'Play Game - 404: Cards Not Found',
      canonicalUrl: `${req.protocol}://${req.get('host')}/game`,
      pageType: 'website'
    };
    res.render('game', context);
  }
}

// Initialize and start the application
const webApp = new WebServerApp();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await webApp.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await webApp.stop();
  process.exit(0);
});

// Start the server
if (require.main === module) {
  webApp.start();
}

module.exports = { WebServerApp, RouteHandler };

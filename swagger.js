import swaggerJsDoc from "swagger-jsdoc";


const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Atlas Ecommerce",
    version: "1.0.0",
    description: "The backend APIs for Atlas Ecommerce",
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  servers: [
 
    {
      url: "http://localhost:5000" 
    }
  ],
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default swaggerDocs;


import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOrganizationSchema, insertUserOrganizationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes for testing
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: result.error.issues 
        });
      }

      const user = await storage.createUser(result.data);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Test data seeding endpoint
  app.post("/api/seed-test-data", async (req, res) => {
    try {
      // Create test user
      const testUser = await storage.createUser({
        username: "testuser",
        name: "Test User",
        email: "test@example.com",
        role: "developer",
        isOnboarded: true
      });

      // Create test organizations
      const org1 = await storage.createOrganization({
        name: "Acme Corp",
        type: "organization",
        domain: "acme.com"
      });

      const org2 = await storage.createOrganization({
        name: "Tech Startup",
        type: "organization",
        domain: "techstartup.com"
      });

      // Add user to organizations
      await storage.createUserOrganization({
        userId: testUser.id,
        organizationId: org1.id,
        role: "admin",
        isActive: true
      });

      await storage.createUserOrganization({
        userId: testUser.id,
        organizationId: org2.id,
        role: "developer",
        isActive: true
      });

      res.json({ 
        success: true, 
        data: { 
          user: testUser, 
          organizations: [org1, org2],
          message: "Test data seeded successfully" 
        }
      });
    } catch (error) {
      console.error("Error seeding test data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Organization routes
  
  // Get user's organizations
  app.get("/api/organizations/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const userOrganizations = await storage.getUserOrganizations(userId);
      res.json(userOrganizations);
    } catch (error) {
      console.error("Error fetching user organizations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Switch tenant context (for logging/analytics)
  app.post("/api/organizations/:organizationId/switch", async (req, res) => {
    try {
      const { organizationId } = req.params;
      if (!organizationId) {
        return res.status(400).json({ error: "Organization ID is required" });
      }

      // Here you could add logic to log the tenant switch for analytics
      // For now, just validate that the organization exists
      const organization = await storage.getOrganization(organizationId);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      // Return success response
      res.json({ success: true, organizationId, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("Error switching tenant:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get organization by ID
  app.get("/api/organizations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Organization ID is required" });
      }

      const organization = await storage.getOrganization(id);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      res.json(organization);
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create new organization
  app.post("/api/organizations", async (req, res) => {
    try {
      const result = insertOrganizationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: result.error.issues 
        });
      }

      const organization = await storage.createOrganization(result.data);
      res.status(201).json(organization);
    } catch (error) {
      console.error("Error creating organization:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Add user to organization
  app.post("/api/organizations/:organizationId/users", async (req, res) => {
    try {
      const { organizationId } = req.params;
      const requestBody = { ...req.body, organizationId };
      
      const result = insertUserOrganizationSchema.safeParse(requestBody);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: result.error.issues 
        });
      }

      const userOrganization = await storage.createUserOrganization(result.data);
      res.status(201).json(userOrganization);
    } catch (error) {
      console.error("Error adding user to organization:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update user role in organization
  app.patch("/api/organizations/:organizationId/users/:userId", async (req, res) => {
    try {
      const { organizationId, userId } = req.params;
      const updates = req.body;

      const userOrganization = await storage.updateUserOrganization(userId, organizationId, updates);
      if (!userOrganization) {
        return res.status(404).json({ error: "User organization relationship not found" });
      }

      res.json(userOrganization);
    } catch (error) {
      console.error("Error updating user organization:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Remove user from organization
  app.delete("/api/organizations/:organizationId/users/:userId", async (req, res) => {
    try {
      const { organizationId, userId } = req.params;

      const success = await storage.removeUserFromOrganization(userId, organizationId);
      if (!success) {
        return res.status(404).json({ error: "User organization relationship not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error removing user from organization:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

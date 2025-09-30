import { 
  type User, type InsertUser,
  type Organization, type InsertOrganization,
  type UserOrganization, type InsertUserOrganization
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Organization methods
  getOrganization(id: string): Promise<Organization | undefined>;
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | undefined>;
  
  // User-Organization relationship methods
  getUserOrganizations(userId: string): Promise<Array<Organization & { role: string; joinedAt: Date; isActive: boolean }>>;
  createUserOrganization(userOrganization: InsertUserOrganization): Promise<UserOrganization>;
  updateUserOrganization(userId: string, organizationId: string, updates: Partial<UserOrganization>): Promise<UserOrganization | undefined>;
  removeUserFromOrganization(userId: string, organizationId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private organizations: Map<string, Organization>;
  private userOrganizations: Map<string, UserOrganization>; // key: "userId:organizationId"

  constructor() {
    this.users = new Map();
    this.organizations = new Map();
    this.userOrganizations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.githubId === githubId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      avatar: insertUser.avatar || null,
      githubId: insertUser.githubId || null,
      role: insertUser.role || "developer",
      isOnboarded: insertUser.isOnboarded || false,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }
    const updatedUser = { ...existingUser, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Organization methods
  async getOrganization(id: string): Promise<Organization | undefined> {
    return this.organizations.get(id);
  }

  async createOrganization(insertOrganization: InsertOrganization): Promise<Organization> {
    const id = randomUUID();
    const organization: Organization = {
      ...insertOrganization,
      id,
      createdAt: new Date(),
      domain: insertOrganization.domain || null,
      logo: insertOrganization.logo || null,
      type: insertOrganization.type || "organization",
    };
    this.organizations.set(id, organization);
    return organization;
  }

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | undefined> {
    const existingOrg = this.organizations.get(id);
    if (!existingOrg) {
      return undefined;
    }
    const updatedOrg = { ...existingOrg, ...updates };
    this.organizations.set(id, updatedOrg);
    return updatedOrg;
  }

  // User-Organization relationship methods
  async getUserOrganizations(userId: string): Promise<Array<Organization & { role: string; joinedAt: Date; isActive: boolean }>> {
    const userOrgRelations = Array.from(this.userOrganizations.values())
      .filter(rel => rel.userId === userId && rel.isActive);
    
    const result: Array<Organization & { role: string; joinedAt: Date; isActive: boolean }> = [];
    
    for (const relation of userOrgRelations) {
      const organization = this.organizations.get(relation.organizationId);
      if (organization) {
        result.push({
          ...organization,
          role: relation.role,
          joinedAt: relation.joinedAt || new Date(),
          isActive: relation.isActive,
        });
      }
    }
    
    return result;
  }

  async createUserOrganization(insertUserOrg: InsertUserOrganization): Promise<UserOrganization> {
    const key = `${insertUserOrg.userId}:${insertUserOrg.organizationId}`;
    const userOrganization: UserOrganization = {
      ...insertUserOrg,
      joinedAt: new Date(),
      isActive: insertUserOrg.isActive ?? true,
      role: insertUserOrg.role || "developer",
    };
    this.userOrganizations.set(key, userOrganization);
    return userOrganization;
  }

  async updateUserOrganization(userId: string, organizationId: string, updates: Partial<UserOrganization>): Promise<UserOrganization | undefined> {
    const key = `${userId}:${organizationId}`;
    const existing = this.userOrganizations.get(key);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...updates };
    this.userOrganizations.set(key, updated);
    return updated;
  }

  async removeUserFromOrganization(userId: string, organizationId: string): Promise<boolean> {
    const key = `${userId}:${organizationId}`;
    return this.userOrganizations.delete(key);
  }
}

export const storage = new MemStorage();

import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// Define your custom permissions (merge with defaults)
const statement = {
	...defaultStatements,
	// Add any custom resources if needed
} as const;

export const ac = createAccessControl(statement);

// Admin role - full permissions
export const admin = ac.newRole({
	...adminAc.statements, // includes all default admin permissions
});

// Agent role - only user:create permission
export const agent = ac.newRole({
	user: ["create"], // agent can only create users
});

// Regular user - no admin permissions
export const officer = ac.newRole({
	 user: [], 
});

export const customer = ac.newRole({
    user:['get']
})
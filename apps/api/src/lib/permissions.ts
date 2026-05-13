import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// Define your custom permissions (merge with defaults)


const statement = {
	...defaultStatements,
	user:[...defaultStatements.user, 'update'],
	category: ['create', 'get', 'update', 'delete', 'list'],
	product: ['create', 'get', 'update', 'delete', 'list'],
	productVariant: ['create', 'get', 'update', 'delete', 'list'],
	order: ['create', 'get', 'update', 'delete', 'list'],
	walletTransaction: ['create', 'get', 'update', 'delete', 'list'],
	walletConfig: ['create', 'get', 'update', 'delete', 'list'],
	loyaltyTier: ['create', 'get', 'update', 'delete', 'list'],
	promotion: ['create', 'get', 'update', 'delete', 'list'],

} as const;

export const ac = createAccessControl(statement);

// Admin role - full permissions
export const admin = ac.newRole({
	...adminAc.statements, // includes all default admin permissions
	category: ['create', 'get', 'update', 'delete', 'list'],
	product: ['create', 'get', 'update', 'delete', 'list'],
	productVariant: ['create', 'get', 'update', 'delete', 'list'],
	order: ['create', 'get', 'update', 'delete', 'list'],
	walletTransaction: ['create', 'get', 'update', 'delete', 'list'],
	walletConfig: ['create', 'get', 'update', 'delete', 'list'],
	loyaltyTier: ['create', 'get', 'update', 'delete', 'list'],
	promotion: ['create', 'get', 'update', 'delete', 'list'],
});

// Agent role - only user:create permission
export const agent = ac.newRole({
	user: ["create"],
	category: ['get', 'list'],
	product: ['get', 'list'],
	productVariant: ['get', 'list'],
	order: ['get', 'list'],
	walletTransaction: ['get', 'list'],
	walletConfig: ['get', 'list'],
	loyaltyTier: ['get', 'list'],
	promotion: ['get', 'list'],
});

// Regular user - no admin permissions
export const officer = ac.newRole({
	user: ['create', 'list', 'update'],
	category: ['get', 'list', 'create', 'update'],
	product: ['get', 'list', 'create', 'update'],
	productVariant: ['get', 'list', 'create', 'update'],
	order: ['get', 'list', 'create', 'update'],
	walletTransaction: ['get', 'list', 'create', 'update'],
	walletConfig: ['get', 'list', 'create', 'update'],
	loyaltyTier: ['get', 'list', 'create', 'update'],
	promotion: ['get', 'list', 'create', 'update'],
});

export const customer = ac.newRole({
	category: ['get', 'list'],
	product: ['get', 'list'],
	productVariant: ['get', 'list'],
	order: ['create', 'get', 'list'],
	walletTransaction: ['get', 'list'],
	walletConfig: ['get', 'list'],
	loyaltyTier: ['get', 'list'],
	promotion: ['get', 'list'],
})
import { registerUser, validateUser } from '../hooks/useAuth';

// Test user credentials
export const testUsers = [
  {
    email: 'client@example.com',
    password: 'client123',
    role: 'client' as const,
    fullName: 'Test Client',
    phone: '+1234567890'
  },
  {
    email: 'designer@example.com',
    password: 'designer123',
    role: 'designer' as const,
    fullName: 'Test Designer',
    phone: '+1987654321'
  }
];

// Function to set up test users
export const setupTestUsers = async () => {
  try {
    console.log('Starting test users setup...');
    for (const user of testUsers) {
      console.log(`Processing ${user.role} user: ${user.email}`);
      const result = await registerUser(
        user.email,
        user.password,
        user.role,
        {
          fullName: user.fullName,
          phone: user.phone,
          lastLogin: new Date().toISOString()
        }
      );
      
      if (result.success) {
        console.log(`✅ Successfully created ${user.role} user: ${user.email}`);
        console.log('User details:', JSON.stringify(result.user, null, 2));
      } else {
        console.warn(`⚠️ ${result.message} (${user.email})`);
        // If user already exists, try to log in with the credentials
        if (result.message.includes('already registered')) {
          console.log('User already exists, attempting to verify credentials...');
          const { isValid } = await validateUser(user.email, user.password, user.role);
          if (isValid) {
            console.log(`✅ Verified existing ${user.role} user: ${user.email}`);
          } else {
            console.error(`❌ Failed to verify existing user: ${user.email}`);
          }
        }
      }
    }
    console.log('✅ Test users setup completed');
    return { success: true, message: 'Test users setup completed' };
  } catch (error) {
    console.error('❌ Error setting up test users:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Function to get test user credentials
export const getTestUserCredentials = (role: 'client' | 'designer') => {
  const user = testUsers.find(u => u.role === role);
  if (!user) {
    throw new Error(`No test user found for role: ${role}`);
  }
  return {
    email: user.email,
    password: user.password
  };
};

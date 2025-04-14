const dataService = require('../services/dataService');

async function initAdmin() {
    try {
        // Wait for data files to be initialized
        await dataService.ensureDataFiles();

        // Check if admin user already exists
        const existingAdmin = await dataService.findUser('admin12#');
        
        if (!existingAdmin) {
            // Create new admin user
            await dataService.createUser({
                username: 'admin12#',
                password: 'abcd@1234'
            });
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error initializing admin:', error);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    process.exit(1);
});

initAdmin(); 
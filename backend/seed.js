const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artcraft');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: '123', // In production, this should be hashed
      role: 'admin'
    });

    // Create regular user (sharad)
    const regularUser = await User.create({
      name: 'Sharad',
      email: 'sharad@gmail.com',
      password: '123', // In production, this should be hashed
      role: 'user'
    });

    console.log('Admin user created:', adminUser.email);
    console.log('Regular user created:', regularUser.email);

    // Create products with only MongoDB ObjectIds
    await Product.insertMany([
      {
        name: 'Acrylic Paint Set',
        description: 'Professional 12-color acrylic paint set, perfect for canvas painting',
        price: 24.99,
        category: 'Painting',
        imageUrl: '/uploads/acrylic-paint.jpg',
        stock: 50
      },
      {
        name: 'Sketch Book',
        description: 'A4 size, 100 pages, suitable for pencil and charcoal sketching',
        price: 9.99,
        category: 'Drawing',
        imageUrl: '/uploads/sketch-book.jpg',
        stock: 100
      },
      {
        name: 'Brush Set',
        description: 'Set of 10 different size brushes for watercolor and acrylic painting',
        price: 15.99,
        category: 'Painting',
        imageUrl: '/uploads/brush-set.jpg',
        stock: 30
      },
      {
        name: 'Colored Pencils',
        description: '24 premium colored pencils for professional artists',
        price: 19.99,
        category: 'Drawing',
        imageUrl: '/uploads/colored-pencils.jpg',
        stock: 45
      },
      {
        name: 'Clay Set',
        description: 'Modeling clay set with tools, perfect for sculpture',
        price: 29.99,
        category: 'Sculpture',
        imageUrl: '/uploads/clay-set.jpg',
        stock: 25
      },
      {
        name: 'Watercolor Paint Palette',
        description: 'Premium watercolor paint set with 24 vibrant colors',
        price: 32.50,
        category: 'Painting',
        imageUrl: '/uploads/watercolor-palette.jpg',
        stock: 40
      }
    ]);

    const allProducts = await Product.find();
    console.log('Products created:', allProducts.length);
    console.log('Database seeded successfully!');
    console.log('\nTest Account Credentials:');
    console.log('Admin Email: admin@gmail.com');
    console.log('Admin Password: 123');
    console.log('User Email: sharad@gmail.com');
    console.log('User Password: 123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData(); 
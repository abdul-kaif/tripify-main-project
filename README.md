# ✈️ Tripify

**AI-Powered Travel & Booking Platform**

Tripify is a comprehensive full-stack travel platform that leverages artificial intelligence to provide personalized trip recommendations and seamless booking experiences. Built with the MERN stack, it combines intelligent travel planning with robust booking management and payment processing.





## 🖼 Screenshots

![](/screenshots/home.png)
*Home Page*

![](/screenshots/signup.png)
*Signup Page*

![](/screenshots/login.png)
*Login Page*

![](/screenshots/askAi.png)
*AI Travel Assistant*

![](/screenshots/gMapApi.png)
*Map & Location View*

![](/screenshots/Bookings.png)
*Bookings & Trip Management*

![](/screenshots/adminProfile.png)
*Admin Dashboard*


---

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **Smart Trip Recommendations** - AI-generated personalized travel suggestions
- **Intelligent Destination Matching** - Find perfect destinations based on preferences

### 🔐 Authentication & Authorization
- **JWT-Based Security** - Secure token-based authentication
- **Role-Based Access Control** - Separate Admin and User workflows
- **Protected Routes** - Secure API endpoints with middleware protection

### 💳 Payment & Booking
- **Stripe Integration** - Secure payment processing
- **Booking Management** - Complete booking lifecycle handling
- **Payment Tracking** - Real-time payment status updates
- **Invoice Generation** - Automated booking confirmations

### 🗺️ Location Services
- **Google Maps Integration** - Interactive location visualization
- **Route Planning** - View trip routes and destinations
- **Location Search** - Find and explore destinations worldwide

### 🔍 Advanced Search & Filtering
- **Multi-Parameter Search** - Filter by price, rating, popularity
- **Offer-Based Filtering** - Find special deals and discounts
- **Sort Options** - Price, rating, popularity-based sorting
- **Real-Time Results** - Instant search updates

### 👨‍💼 Admin Dashboard
- **User Management** - View, edit, and manage user accounts
- **Booking Management** - Track and manage all bookings
- **Payment Overview** - Monitor payment transactions
- **Package Management** - Create and manage travel packages
- **Analytics & Reports** - Insights into platform performance

### 📱 User Features
- **Browse Packages** - Explore travel packages with detailed information
- **User Reviews** - Read and write reviews for packages
- **Booking History** - View past and upcoming bookings
- **Profile Management** - Update personal information and preferences
- **Wishlist** - Save favorite packages for later

---

## 🛠️ Tech Stack

### Frontend
- **React** - Component-based UI library
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Google Maps React** - Interactive maps integration

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM for MongoDB

### APIs & Services
- **Stripe API** - Payment processing
- **Google Maps API** - Location services and visualization
- **AI Services** - Trip recommendation and package generation
- **JWT** - Authentication tokens

### DevOps & Tools
- **Git** - Version control
- **npm** - Package management
- **dotenv** - Environment configuration

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe Account (for payment processing)
- Google Maps API Key
- AI API credentials (OpenAI/similar)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/tripify.git
cd tripify
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
MONGO_URL=
JWT_SECRET=
SERVER_URL=
STRIPE_SECRET_KEY=
DEEPSEEK_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_APP_GOOGLE_MAPS_KEY=
VITE_OPENCAGE_API_KEY=
VITE_API_URL=
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
- **Local Frontend:** `http://localhost:5173`
- **Local Backend API:** `http://localhost:8000/api`

---

## 🚀 Usage

### For Users
1. **Sign Up/Login** - Create an account or login to existing account
2. **Browse Packages** - Explore available travel packages
3. **Use AI Recommendations** - Get personalized trip suggestions
4. **Search & Filter** - Find packages by price, rating, or offers
5. **View on Map** - Visualize destinations on Google Maps
6. **Book Package** - Select dates and number of travelers
7. **Make Payment** - Secure checkout via Stripe
8. **View Bookings** - Track your bookings in dashboard
9. **Write Reviews** - Share your experience

### For Admins
1. **Login to Admin Panel** - Access admin dashboard
2. **Manage Users** - View and manage user accounts
3. **Manage Packages** - Create, edit, delete travel packages
4. **Review Bookings** - Monitor all platform bookings
5. **Track Payments** - View payment transactions and status
6. **AI Package Control** - Manage AI-generated packages
7. **View Analytics** - Monitor platform performance

---

## 📁 Project Structure

```
tripify/
├── backend/
│   ├── controllers/       # Request handlers and business logic
│   ├── models/           # MongoDB schemas and database models
│   ├── routes/           # API route definitions
│   ├── middleware/       # Authentication and validation middleware
│   ├── utils/            # Helper functions and utilities
│   └── config/           # Configuration files
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page-level components
│   │   ├── utils/        # Utility functions
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   └── assets/       # Images and static files
│   └── public/           # Public assets
└── README.md
```


## 🎨 Features in Detail

### AI Trip Recommendations
- Analyzes user preferences and travel history
- Considers budget, duration, and interests
- Suggests personalized destinations and packages

### Advanced Search & Filtering
- **Price Range:** Filter by minimum and maximum price
- **Rating:** Filter by user ratings (1-5 stars)
- **Popularity:** Sort by number of bookings
- **Offers:** Show packages with active discounts
- **Location:** Filter by destination or region
- **Duration:** Filter by trip length

### Payment Processing
- Secure payment via Stripe
- Support for multiple payment methods
- Automatic invoice generation
- Payment status tracking
- Refund processing

### Admin Dashboard Features
- **User Analytics:** Total users, active users, new signups
- **Booking Analytics:** Total bookings, revenue, popular packages
- **Payment Tracking:** Successful payments, pending, failed
- **Package Management:** CRUD operations on packages
- **Review Moderation:** Approve/reject user reviews

---

## 🔮 Future Enhancements

- 🌐 **Multi-Language Support** - Translate content to multiple languages
- 📱 **Mobile App** - React Native mobile application
- ✉️ **Email Notifications** - Booking confirmations and reminders
- 🔔 **Real-Time Notifications** - WebSocket-based updates
- 📊 **Advanced Analytics** - Detailed insights and reporting
- 💬 **Live Chat Support** - Customer support chat
- 🎫 **Digital Tickets** - QR code-based booking tickets
- 🌦️ **Weather Integration** - Real-time weather data for destinations
- 🏨 **Hotel & Flight Booking** - Expand to full travel services
- 📸 **Photo Gallery** - User-uploaded destination photos
- ⭐ **Loyalty Program** - Reward frequent travelers
- 🗓️ **Calendar Integration** - Sync bookings with Google Calendar

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Varshit Tyagi**
- 🎓 Computer Science Engineering Student
- 💼 Backend-focused Full Stack Developer
- 🔗 [GitHub](https://github.com/new-Varshit)
- 💼 [LinkedIn](https://linkedin.com/in/varshit-tyagi-298617248)
- 📧 [Email](mailto:vksingh1122001@gmail.com)

---

## 🙏 Acknowledgments

- **Stripe** - Payment processing infrastructure
- **Google Maps** - Location services and visualization
- **OpenAI/AI Service** - Intelligent recommendations
- **MongoDB Atlas** - Database hosting
- **React Community** - UI components and tools

---

## 📞 Support

For issues, questions, or suggestions:
- 📧 Email: tyagivasu749@gmail.com
- 🐛 [Report Issues](https://github.com/new-Varshit/tripify/issues)
- 💬 [Discussions](https://github.com/new-Varshit/tripify/discussions)

---

## 📈 Project Status

🟢 **Active Development** - Regular updates and new features

---

<div align="center">
  <strong>Made with ❤️ by Varshit Tyagi</strong>
  <br>
  <sub>Transforming travel planning with AI-powered intelligence.</sub>
</div>

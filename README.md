# DineSphere – Restaurant Management System

##  Project Overview
DineSphere is a web-based restaurant management system built as a capstone project.  
It helps Admins, Staff, and Customers manage reservations, menus, and orders in one system.

---

##  User Roles
- **Admin**: Manage menu, tables, reservations, and reports.
- **Staff**: Handle dine-in/takeout orders and update statuses.
- **Customer**: Browse menu, make reservations, and place takeout orders.

---

## Tech Stack
- **Frontend:** React, Vite, React Router
- **Styles:** Custom CSS (`theme.css`, `index.css`)
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT (httpOnly cookie)
- **Dev Tools:** ESLint (optional), morgan, cors 
- **Hosting**: Local (XAMPP) to Vercel 

---
## 🔑 Admin Dashboard 
**Username:**: admin@gmail.com
**Password:** Admin@123

##  Setup Instructions
1. Clone the repo  
   ```bash
   git clone https://github.com/your-username/dinesphere-restaurant-management.git
   cd dinesphere-restaurant-management

**Client:**
- npm run dev        
- npm run build      
- npm run preview    

**Server:**
- npm run dev 

###  Environment Variables

Create a `.env` file inside the `server` directory and add the following:

```env
MONGODB_URI=mongodb+srv://dinesphere_restaurant:Dinesphere%40123@cluster0.diqn0np.mongodb.net/dinesphere?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://127.0.0.1:5173

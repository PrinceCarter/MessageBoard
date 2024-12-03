# Message Board App 📋

A React Native application with a simple message board functionality that allows users to register, log in, and post messages. Built with Expo and Supabase, the app integrates user authentication, real-time updates, and a dynamic UI.

## Features 🚀

### Frontend

#### 1. User Authentication
- Registration screen with email, password, and user profile fields (e.g., avatar, first name, last name)
- Login screen with email and password

#### 2. Message Board
- Displays a list of posts with:
  - Post content
  - Author's name and avatar
  - Post creation date (formatted)
- Real-time updates when new posts are created or deleted
- Allows logged-in users to create new posts

#### 3. Responsive & Dynamic UI
- KeyboardAvoidingView ensures inputs are accessible when the keyboard is active
- Loading skeletons while fetching data
- Error handling with user-friendly messages
- Consistent design using Gluestack UI components

#### 4. State Management
- Authentication state is managed via Supabase
- Post list dynamically updates based on real-time changes

### Backend

#### 1. Endpoints
- `POST /register`: Create a new user (handled by Supabase)
- `POST /login`: Authenticate users and manage sessions (handled by Supabase)
- `GET /posts`: Fetch all posts with user details (handled by Supabase)
- `POST /posts`: Create a new post (authentication required)

#### 2. Database
- Supabase is used as the backend-as-a-service
- Tables:
  - **users**: Stores user profiles (e.g., name, avatar)
  - **posts**: Stores posts with references to user IDs

#### 3. Authentication
- Supabase handles JWT-based authentication securely

## Installation & Setup 🛠️

### Prerequisites
- Node.js (>= 18 recommended)
- Expo CLI installed globally (`npm install -g expo-cli`)

### Steps to Run Frontend

1. Clone the repository:
   ```bash
   git clone https://github.com/PrinceCarter/MessageBoard.git
   cd MessageBoard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo app:
   ```bash
   npx expo start
   ```

4. Scan the QR code with the Expo Go app or launch the app in an iOS/Android simulator.

## Assumptions & Shortcuts

1. **Focus on Core Features**: Time constraints limited advanced functionality such as pagination and post editing.
2. **Security**: Supabase handles authentication and sensitive data securely, reducing the need for custom implementation.
3. **Styling**: Used Gluestack UI and NativeWind for a polished yet efficient UI.

## How It Works 💡

1. Users register and log in through the Supabase-authenticated backend.
2. The message board dynamically fetches posts and integrates real-time updates using Supabase's subscription model.
3. Posts include enriched user details (name, avatar) fetched from the `users` table.

## Tools & Libraries 🧰

- **Frontend**: React Native, Expo, Gluestack UI, NativeWind
- **Backend**: Supabase
- **Real-time Updates**: Supabase's `realtime` channel
- **State Management**: React useState, useEffect
- **Styling**: Gluestack UI, Tailwind CSS

## Known Issues / Future Enhancements ✨

1. **Error States**: Improved UI for handling backend errors gracefully.
2. **Advanced Features**:
   - Post editing and deletion by users
3. **Web Compatibility**: The current setup does not support web environments due to the usage of `AsyncStorage` and React Native-specific configurations. This can be addressed in the future by implementing platform-specific solutions or using a unified storage strategy.

## Key Features
- User Authentication using Supabase.
- Nested navigation structure with clear path definition.
- Custom theming using react-native-paper.
- Deep linking capabilities with expo-linking.

# Getting Started
## Prerequisites
- Node.js
- npm or yarn
- React Native development environment
- Expo CLI (if using Expo)
- Supabase account


## Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/nicholasohjj/HacknRoll.git
2. **Navigate to the project directory:**
   ```bash
   cd HacknRoll
3. **Install dependencies:**
   ```bash
   npm install
   ```

## Setting up Supabase
1. Create a new project in Supabase.
2. Configure the authentication settings in your Supabase project.
3. Obtain your Supabase URL and public API key.
4. Create an .env file in the root of your project and add your Supabase URL and API 
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_public_api_key
   ```

## Usage
1. **Start the server:**
   ```bash
   npx expo start
   ```
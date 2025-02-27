# DebtX

## Project Overview

DebtX is a full-stack debt collection and management application designed to streamline tracking and managing customer debts. It features a Next.js frontend for a responsive UI, a Node.js/Express backend with real-time notifications via Socket.IO, and a PostgreSQL database (hosted on Supabase) managed with Prisma ORM. Key functionalities include uploading customer data (via Excel/CSV or single entry), viewing dynamic dashboards, managing payment statuses, and receiving real-time activity updates.

## Setup Instructions

### Local Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/singhjatin297/DebtX.git
   cd DebtX
   ```
2. ```bash
   cd backend
   npm install
   ```

3. ```bash
   cd ..
   npm install
   ```

4. setup .env file based on .env.example for both frontend

5. ```bash
   cd backend
   npm run dev
   ```

6. ```bash
   cd ..
   npm run dev
   ```

7. start both frontend and backend with npm run dev

### Technical Decisions

1.  Next.js: Selected for its fast frontend development, built-in routing, and client-side rendering capabilities, enhancing user experience with a
    responsive dashboard.

2.  Node.js/Express: Provides a lightweight, flexible backend with RESTful APIs and integrates seamlessly with Socket.IO for real-time features.

3.  Prisma: Simplifies database interactions with type-safe queries and migrations, ideal for managing PostgreSQL data.

4.  Socket.IO: Enables real-time updates for notifications (e.g., payment status changes, new customers), improving user engagement.

5.  PostgreSQL (Supabase): Chosen as a hosted SQL database for structured data management, meeting the "SQL/Elasticsearch" requirement (Elasticsearch considered for future search).

6.  JWT with Cookies: Adopted for stateless, secure authentication (using token cookie), aligning with the spec’s "JWT authentication" requirement over session-based cookies.

### Future Improvements

1. Docker Fix: Resolve .env loading issues in docker-compose.yml for seamless containerized deployment.

2. Pagination: Implement for customers and notifications to handle large datasets efficiently.

3. Enhanced Authentication: Explore OAuth or additional JWT features (e.g., refresh tokens) for broader security options.

4. Testing: Add unit and integration tests for API endpoints, Socket.IO events, and frontend components.

5. UI Enhancements: Incorporate more Framer Motion animations for a polished, interactive experience.

6. Search Functionality: Integrate Elasticsearch for advanced search capabilities if required by future needs.

let users = [
  {
    username: "john_doe",
    password: "$2b$10$S9GfNfFirbj5f3Tl2GKWQOyf3TXrENBrhwweoZS8oqwH7cZ6UP6Mi",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    profile: {
      bio: "Software engineer",
      phone: "1234567890",
      photo: "https://example.com/profile.jpg",
      public: true,
    },
  },
  {
    username: "admin",
    password: "$2b$10$42Osz.HUVFyLQH6TcmZzCeBMGh4eM5oqb6IdPzQgD.rB7t9UNBPbG",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    profile: {
      bio: "",
      phone: "",
      photo: "",
      public: false,
    },
  },
];

module.exports = users;

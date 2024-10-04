module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Storefront",
    {
      shop_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      promotional: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
          enable: true,
          text: "Welcome to our store! Enjoy 10% off on your first purchase.",
          link: "/special-offer",
          background_color: "#fffae5",
          text_color: "#333333",
        },
      },
      theme_settings: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
          default_colors: {
            primary: "#1f2937", // Default Primary Color
            secondary: "#3b82f6", // Default Secondary Color
            accent: "#f97316", // Default Accent Color (e.g., for buttons or links)
          },
          navbar: {
            background_color: "#ffffff",
            title: "Store Name",
            text_color: "#000",
            menu: [
              { label: "Home", link: "/" },
              { label: "Shop", link: "/shop" },
              { label: "Contact", link: "/contact" },
            ],
          },
          hero: {
            background_image: "/images/hero-bg.jpg",
            title: "Welcome to our Store",
            subtitle: "Find the best products here",
            button_text: "Shop Now",
            button_link: "/products",
          },
          about_us: {
            title: "About Us",
            content: "We are passionate about delivering high-quality products.",
            image: "/images/about-us.jpg",
            background_color: "#f9f9f9",
          },
        },
      },
    },
    {
      tableName: "storefront",
      timestamps: true,
      paranoid: true,
    }
  );
};

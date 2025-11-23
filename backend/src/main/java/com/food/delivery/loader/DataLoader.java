package com.food.delivery.loader;

import com.food.delivery.model.MenuItem;
import com.food.delivery.model.Restaurant;
import com.food.delivery.model.Role;
import com.food.delivery.model.User;
import com.food.delivery.repository.MenuItemRepository;
import com.food.delivery.repository.RestaurantRepository;
import com.food.delivery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// @Component annotation commented out to disable automatic data loading
// Remove the comment below to re-enable sample data loading on startup
// @Component
public class DataLoader implements CommandLineRunner {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private RestaurantRepository restaurantRepository;

        @Autowired
        private MenuItemRepository menuItemRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                if (userRepository.count() == 0) {
                        // Create Users
                        User admin = new User();
                        admin.setName("Admin User");
                        admin.setEmail("admin@zomato.com");
                        admin.setPassword(passwordEncoder.encode("admin123"));
                        admin.setRole(Role.ADMIN);
                        admin.setImageUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400");
                        userRepository.save(admin);

                        User owner = new User();
                        owner.setName("Restaurant Owner");
                        owner.setEmail("owner@zomato.com");
                        owner.setPassword(passwordEncoder.encode("owner123"));
                        owner.setRole(Role.RESTAURANT_OWNER);
                        owner.setImageUrl("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400");
                        userRepository.save(owner);

                        User user = new User();
                        user.setName("John Doe");
                        user.setEmail("john@gmail.com");
                        user.setPassword(passwordEncoder.encode("user123"));
                        user.setRole(Role.USER);
                        user.setImageUrl("https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400");
                        userRepository.save(user);

                        // Create Restaurants with diverse cuisines and unique images
                        Restaurant r1 = createRestaurant("Pizza Palace", "Authentic Italian Pizzas",
                                        "123 Main St, New York",
                                        "Italian", 4.5, 30, owner,
                                        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800");

                        Restaurant r2 = createRestaurant("Burger Kingdom", "Home of Gourmet Burgers",
                                        "456 Broadway, New York",
                                        "American", 4.2, 25, owner,
                                        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800");

                        Restaurant r3 = createRestaurant("Spice Garden", "Traditional Indian Cuisine",
                                        "789 Park Ave, New York",
                                        "Indian", 4.7, 35, owner,
                                        "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=800");

                        Restaurant r4 = createRestaurant("Sushi World", "Fresh Japanese Delicacies",
                                        "321 Ocean Dr, New York",
                                        "Japanese", 4.6, 40, owner,
                                        "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800");

                        Restaurant r5 = createRestaurant("Taco Fiesta", "Authentic Mexican Street Food",
                                        "654 Sunset Blvd, Los Angeles",
                                        "Mexican", 4.4, 20, owner,
                                        "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800");

                        Restaurant r6 = createRestaurant("Dragon Wok", "Chinese Stir-Fry Specialists",
                                        "987 Chinatown St, San Francisco",
                                        "Chinese", 4.3, 30, owner,
                                        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800");

                        Restaurant r7 = createRestaurant("Pasta Paradise", "Homemade Italian Pasta",
                                        "147 Little Italy, New York",
                                        "Italian", 4.8, 35, owner,
                                        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800");

                        Restaurant r8 = createRestaurant("BBQ Heaven", "Smokey BBQ Delights", "258 Ranch Rd, Texas",
                                        "American BBQ", 4.5, 45, owner,
                                        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800");

                        Restaurant r9 = createRestaurant("Bangkok Bites", "Spicy Thai Cuisine",
                                        "369 Bangkok St, Chicago",
                                        "Thai", 4.6, 30, owner,
                                        "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800");

                        Restaurant r10 = createRestaurant("Mediterranean Grill", "Fresh Mediterranean Flavors",
                                        "741 Olive St, Miami",
                                        "Mediterranean", 4.4, 35, owner,
                                        "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800");

                        // Create Menu Items for each restaurant

                        // Pizza Palace Menu
                        createMenuItem(r1, "Margherita Pizza", "Classic cheese and tomato", 12.99, true,
                                        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500");
                        createMenuItem(r1, "Pepperoni Pizza", "Spicy pepperoni with cheese", 14.99, false,
                                        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500");
                        createMenuItem(r1, "Vegetarian Supreme", "Loaded with fresh vegetables", 13.99, true,
                                        "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500");
                        createMenuItem(r1, "BBQ Chicken Pizza", "Tangy BBQ sauce with chicken", 15.99, false,
                                        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500");

                        // Burger Kingdom Menu
                        createMenuItem(r2, "Classic Cheeseburger", "Beef patty with cheese", 8.99, false,
                                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500");
                        createMenuItem(r2, "Veggie Burger", "Plant-based patty", 9.99, true,
                                        "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500");
                        createMenuItem(r2, "Double Bacon Burger", "Two patties with crispy bacon", 12.99, false,
                                        "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500");
                        createMenuItem(r2, "Chicken Burger", "Grilled chicken fillet", 10.99, false,
                                        "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500");

                        // Spice Garden Menu
                        createMenuItem(r3, "Butter Chicken", "Creamy tomato-based curry", 14.99, false,
                                        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500");
                        createMenuItem(r3, "Paneer Tikka Masala", "Cottage cheese in spiced gravy", 13.99, true,
                                        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500");
                        createMenuItem(r3, "Biryani", "Fragrant rice with spices", 12.99, false,
                                        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500");
                        createMenuItem(r3, "Dal Makhani", "Black lentils in buttery gravy", 11.99, true,
                                        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500");

                        // Sushi World Menu
                        createMenuItem(r4, "California Roll", "Crab, avocado, cucumber", 10.99, false,
                                        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500");
                        createMenuItem(r4, "Salmon Nigiri", "Fresh salmon on rice", 12.99, false,
                                        "https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=500");
                        createMenuItem(r4, "Vegetable Roll", "Fresh vegetables wrapped", 9.99, true,
                                        "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500");
                        createMenuItem(r4, "Tuna Sashimi", "Premium tuna slices", 15.99, false,
                                        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500");

                        // Taco Fiesta Menu
                        createMenuItem(r5, "Beef Tacos", "Seasoned beef in corn tortilla", 8.99, false,
                                        "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500");
                        createMenuItem(r5, "Chicken Quesadilla", "Grilled chicken with cheese", 10.99, false,
                                        "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500");
                        createMenuItem(r5, "Veggie Burrito", "Rice, beans, and vegetables", 9.99, true,
                                        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500");
                        createMenuItem(r5, "Nachos Supreme", "Loaded nachos with toppings", 11.99, true,
                                        "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=500");

                        // Dragon Wok Menu
                        createMenuItem(r6, "Kung Pao Chicken", "Spicy stir-fried chicken", 13.99, false,
                                        "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500");
                        createMenuItem(r6, "Vegetable Fried Rice", "Wok-tossed rice with veggies", 10.99, true,
                                        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500");
                        createMenuItem(r6, "Sweet and Sour Pork", "Crispy pork in tangy sauce", 14.99, false,
                                        "https://images.unsplash.com/photo-1576458088443-04a19e2a0fa7?w=500");
                        createMenuItem(r6, "Spring Rolls", "Crispy vegetable rolls", 7.99, true,
                                        "https://images.unsplash.com/photo-1558030089-67f5749d35b5?w=500");

                        // Pasta Paradise Menu
                        createMenuItem(r7, "Spaghetti Carbonara", "Creamy bacon pasta", 13.99, false,
                                        "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500");
                        createMenuItem(r7, "Penne Arrabbiata", "Spicy tomato pasta", 11.99, true,
                                        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500");
                        createMenuItem(r7, "Lasagna", "Layered pasta with meat sauce", 14.99, false,
                                        "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500");
                        createMenuItem(r7, "Fettuccine Alfredo", "Creamy cheese sauce", 12.99, true,
                                        "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500");

                        // BBQ Heaven Menu
                        createMenuItem(r8, "Smoked Brisket", "Slow-cooked beef brisket", 18.99, false,
                                        "https://images.unsplash.com/photo-1544025162-d76694265947?w=500");
                        createMenuItem(r8, "BBQ Ribs", "Fall-off-the-bone ribs", 19.99, false,
                                        "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500");
                        createMenuItem(r8, "Pulled Pork Sandwich", "Tender pulled pork", 12.99, false,
                                        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500");
                        createMenuItem(r8, "Grilled Corn", "Charred sweet corn", 5.99, true,
                                        "https://images.unsplash.com/photo-1551062088-5ccbc1f8b9fc?w=500");

                        // Bangkok Bites Menu
                        createMenuItem(r9, "Pad Thai", "Stir-fried rice noodles", 12.99, false,
                                        "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500");
                        createMenuItem(r9, "Green Curry", "Spicy coconut curry", 13.99, true,
                                        "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500");
                        createMenuItem(r9, "Tom Yum Soup", "Hot and sour soup", 9.99, false,
                                        "https://images.unsplash.com/photo-1547928576-c2c2e8b1f567?w=500");
                        createMenuItem(r9, "Mango Sticky Rice", "Sweet dessert", 7.99, true,
                                        "https://images.unsplash.com/photo-1604908554025-1dcd8e2b4e58?w=500");

                        // Mediterranean Grill Menu
                        createMenuItem(r10, "Chicken Shawarma", "Spiced grilled chicken wrap", 11.99, false,
                                        "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500");
                        createMenuItem(r10, "Falafel Plate", "Crispy chickpea fritters", 10.99, true,
                                        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500");
                        createMenuItem(r10, "Greek Salad", "Fresh vegetables with feta", 9.99, true,
                                        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500");
                        createMenuItem(r10, "Lamb Kebab", "Grilled lamb skewers", 16.99, false,
                                        "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=500");

                        System.out.println("Data loaded successfully: 10 restaurants with 40 menu items!");
                } else {
                        updateExistingUsers();
                }
        }

        private void updateExistingUsers() {
                userRepository.findAll().forEach(user -> {
                        if (user.getImageUrl() == null || user.getImageUrl().isEmpty()) {
                                if (user.getRole() == Role.ADMIN) {
                                        user.setImageUrl(
                                                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400");
                                } else if (user.getRole() == Role.RESTAURANT_OWNER) {
                                        user.setImageUrl(
                                                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400");
                                } else {
                                        user.setImageUrl(
                                                        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400");
                                }
                                userRepository.save(user);
                        }
                });
                System.out.println("Updated existing users with profile photos.");
        }

        private Restaurant createRestaurant(String name, String description, String address,
                        String cuisineType, double rating, int deliveryTime, User owner, String imageUrl) {
                Restaurant restaurant = new Restaurant();
                restaurant.setName(name);
                restaurant.setDescription(description);
                restaurant.setAddress(address);
                restaurant.setCuisineType(cuisineType);
                restaurant.setImageUrl(imageUrl);
                restaurant.setAvgRating(rating);
                restaurant.setDeliveryTime(deliveryTime);
                restaurant.setOwner(owner);
                return restaurantRepository.save(restaurant);
        }

        private void createMenuItem(Restaurant restaurant, String name, String description,
                        double price, boolean veg, String imageUrl) {
                MenuItem menuItem = new MenuItem();
                menuItem.setRestaurant(restaurant);
                menuItem.setName(name);
                menuItem.setDescription(description);
                menuItem.setPrice(price);
                menuItem.setVeg(veg);
                menuItem.setImageUrl(imageUrl);
                menuItemRepository.save(menuItem);
        }
}

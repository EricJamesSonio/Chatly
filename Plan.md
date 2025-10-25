Build a simple full stack project, CHATLY

have a personal account like messenger! 
each account has friends list, and profile (stored profile image, name (optional : Location, birthday))

fetaures, add some info in proifle like hobbies, talents etc.
add socials! such as the readl facebook acc, tiktok, etc. just a url link

{requirements}
database:
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  birthdate DATE NOT NULL,
  profile_image VARCHAR(255) DEFAULT 'default.png',
  location VARCHAR(100),
  hobbies TEXT,
  talents TEXT,
  facebook_url VARCHAR(255),
  tiktok_url VARCHAR(255),
  instagram_url VARCHAR(255)
);

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE friendlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

server:
--> src
----> database
-------> models (tables creation indatabase)
-------> seeds (seeders fpr that tables)
-------> db.js (creation of the database)
-------> init.js (for seeding all)
----> model (class that interact with teh database!)
----> controlles (calling the models just havign soem validations to make it work! and checkers)
----> routes (handles routes! for each api call)
----> server.js (to start the server!)
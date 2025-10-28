export const seedUsers = async (db) => {
  const users = [
    ['Alice', '2000-05-01', 'alice.png', 'alice-cover.jpg', 'Manila', 'Reading, Singing', 'Dancing', 'https://facebook.com/alice', 'https://tiktok.com/@alice', 'https://instagram.com/alice'],
    ['Bob', '1999-07-10', 'bob.png', 'bob-cover.jpg', 'Cebu', 'Gaming, Coding', 'Drawing', 'https://facebook.com/bob', 'https://tiktok.com/@bob', 'https://instagram.com/bob'],
    ['Yellow', '2001-02-14', 'yellow.png', 'yellow-cover.jpg', 'Davao', 'Photography, Music', 'Guitar', 'https://facebook.com/charlie', 'https://tiktok.com/@charlie', 'https://instagram.com/charlie'],
    ['SpongeBob', '1998-12-05', 'spongebob.png', 'spongebob-cover.jpg', 'Quezon City', 'Baking, Dancing', 'Singing', 'https://facebook.com/diana', 'https://tiktok.com/@diana', 'https://instagram.com/diana'],
    ['Red', '2002-06-21', 'red.png', 'red-cover.jpg', 'Bohol', 'Running, Movies', 'Acting', 'https://facebook.com/ethan', 'https://tiktok.com/@ethan', 'https://instagram.com/ethan'],
    ['Patrick', '2000-11-08', 'patrick.png', 'patrick-cover.jpg', 'Laguna', 'Art, K-pop', 'Painting', 'https://facebook.com/fiona', 'https://tiktok.com/@fiona', 'https://instagram.com/fiona']
  ];

  for (const user of users) {
    await db.execute(`
      INSERT INTO users (
        name, birthdate, profile_image, cover_photo, location,
        hobbies, talents, facebook_url, tiktok_url, instagram_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, user);
  }

  console.log('🌱 Seeded users w/ cover photos');
};

// Route to fetch contact information
export const getContact = (req, res) => {
  try {
    res.status(200).json({
      info:
      [
        {adress: '123 Coffee Lane, Brew City, CA 12345',
        telefonnummer: '+42 123 456789',
        email: "airbean@gmail.com",
        socialMedia: {
          facebook: 'https://www.facebook.com/airbean',
          instagram: 'https://www.instagram.com/airbean',
          twitter: 'https://www.twitter.com/airbean',
    }}],

    aboutus:
    [
      {title: 'About Us',
      description: 'Airbean is a coffee shop that specializes in serving high-quality coffee and providing a cozy atmosphere for our customers. Our mission is to create a welcoming space where people can come together, enjoy great coffee, and connect with one another.'},
    ]});

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

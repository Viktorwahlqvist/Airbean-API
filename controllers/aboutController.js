// Route to fetch contact information
export const getContact = (req, res) => {
  try {
    res.status(200).json({
        adress: '123 Coffee Lane, Brew City, CA 12345',
        telefonnummer: '+42 123 456789',
        email: "airbean@gmail.com", 
        socialMedia: {
            facebook: 'https://www.facebook.com/airbean',
            instagram: 'https://www.instagram.com/airbean',
            twitter: 'https://www.twitter.com/airbean',
        } 
      });
    } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

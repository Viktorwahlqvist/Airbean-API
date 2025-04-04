export const getUserById = (req, res) => {
    const id = req.id;
    res.json({ message: `Hämtar användare med ID: ${id}` });
  };
  
  export const deleteUser = (req, res) => {
    const id = req.id;
    res.json({ message: `Användare med ID: ${id} borttagen (låtsas bara 😄)` });
  };
  
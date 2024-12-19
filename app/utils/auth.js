const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

exports.authenticateUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Unauthorized' });

    req.userId = decoded.id;
    console.log('decoded', decoded);
    next();
  });
};

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const backendDir = path.resolve('../mi-portafolio-backend');

console.log('Installing backend dependencies...');
execSync('pnpm add geoip-lite axios', { cwd: backendDir, stdio: 'inherit' });

console.log('Patching User model...');
const userModelPath = path.join(backendDir, 'models', 'User.js');
let userModelCode = fs.readFileSync(userModelPath, 'utf8');

userModelCode = userModelCode.replace(
  /password:\s*{\s*type:\s*String,\s*required:\s*true\s*(?:\/\/.*)?\s*}/g,
  `password: {
    type: String,
    required: false
  },
  firstName: { type: String },
  lastName: { type: String },
  displayName: { type: String },
  birthDate: { type: Date },
  country: { type: String },
  authProvider: { type: String, default: 'local' }`
);

// If the user's manual registration still needs password, the controller should validate it, which it does.
// Save
fs.writeFileSync(userModelPath, userModelCode);


console.log('Patching Auth routes...');
const authRoutePath = path.join(backendDir, 'routes', 'auth.js');
let authRouteCode = fs.readFileSync(authRoutePath, 'utf8');

// Insert google route before module.exports
const googleRouteCode = `

/**
 * @route   POST /api/auth/google
 * @desc    Autentica o registra un usuario con Google
 * @access  Public
 */
router.post('/google', async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ message: 'No access token provided' });

  const axios = require('axios');
  const geoip = require('geoip-lite');

  try {
    // 1. Obtener perfil de Google
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: \`Bearer \${access_token}\` }
    });

    const { email, given_name, family_name } = data;

    // 2. Determinar ubicación con GeoIP
    let country = 'Desconocido';
    // Tomamos la IP, esto funcina en local (devuelve ::1) y en produccion (ej. a traves de cabeceras)
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // Si estamos en localhost y probamos, podemos forzar una IP de prueba para ver que funciona
    if (ip === '::1' || ip === '127.0.0.1') {
       // ip = '207.97.227.239'; // IP de prueba de USA - Descomentar para testing local
    }
    const geo = geoip.lookup(ip);
    if (geo) {
       country = geo.country;
    }

    // 3. Buscar si el usuario existe
    let user = await User.findOne({ email });

    // 4. Si no existe, lo creamos
    if (!user) {
      user = new User({
        email,
        firstName: given_name || '',
        lastName: family_name || '',
        country,
        authProvider: 'google',
        // Generamos una contraseña aleatoria muy compleja ya que no la usará
        password: await bcrypt.hash(Math.random().toString(36).slice(-10) + Date.now().toString(36), 10)
      });
      await user.save();
    }

    // 5. Generar JWT estándar
    const payload = { user: { id: user.id } };
    const jwt = require('jsonwebtoken'); // Para asegurar scope
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            email: user.email, 
            firstName: user.firstName,
            country: user.country
          } 
        });
      }
    );

  } catch (err) {
    console.error('Error en auth de Google:', err.message);
    res.status(500).json({ message: 'Error en el servidor al autenticar con Google' });
  }
});

`;

authRouteCode = authRouteCode.replace('module.exports = router;', googleRouteCode + '\nmodule.exports = router;');

// Add a manual registration handler for new fields in manual register (first/last/displayName/birthdate)
authRouteCode = authRouteCode.replace('const { email, password } = req.body;', 'const { email, password, firstName, lastName, displayName, birthDate } = req.body;');
authRouteCode = authRouteCode.replace(
  /email,\s*password\s*(?:\/\/.*)?/g, 
  `email,
      password,
      firstName,
      lastName,
      displayName,
      birthDate`
);

fs.writeFileSync(authRoutePath, authRouteCode);

console.log('Backend patched successfully!');

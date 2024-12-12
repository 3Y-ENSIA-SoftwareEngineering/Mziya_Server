const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { createClient } = require('@supabase/supabase-js');
const app = express();
app.use(cors());
app.use(express.json());
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase Key:', process.env.SUPABASE_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Fetch user data
app.get('/user', async (req, res) => {
  const user = req.user;  // Assume user is authenticated with some middleware

  try {
    const { data, error } = await supabase
      .from('users')
      .select('name, email, address')
      .eq('id', user.id)
      .single();
    if (error) throw error;

    const [firstName, lastName] = (data.name || '').split(' ');
    res.json({ firstName, lastName, email: data.email, location: data.address || '' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch job deals
app.get('/jobDeals', async (req, res) => {
  const user = req.user;

  try {
    const { data, error } = await supabase
      .from('job_contract')
      .select(`*, jobs:job_id(description, job_category), worker:user_worker_id(name), home_owner:user_home_owner_id(name)`)
      .or(`user_worker_id.eq.${user.id},user_home_owner_id.eq.${user.id}`);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch job offers
app.get('/jobOffers', async (req, res) => {
  const user = req.user;

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('home_owner_id', user.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change password
app.post('/changePassword', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  if (newPassword !== req.body.confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match" });
  }

  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload profile picture
app.post('/uploadProfilePic', async (req, res) => {
  const file = req.file;  // Use some middleware to handle file uploads (e.g., multer)
  try {
    const filePath = `profile-pictures/${Math.random()}.${file.ext}`;
    const { error: uploadError } = await supabase.storage.from('profile-pictures').upload(filePath, file.buffer);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
    res.json({ publicUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));

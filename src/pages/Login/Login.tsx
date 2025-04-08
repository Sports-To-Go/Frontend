import Layout from '../../components/Layout/Layout'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";

//pentru testare la token
//email: test@test.com
//password: 123456
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      console.log("Token:", token); // trimite-l la backend
    } catch (err) {
      console.error(err,"Error logging in");
    }
  };

  return (
    <Layout>
    <div>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
    </Layout>
  );
};

export default Login;

import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

function Login() {

    const [currState, setCurrState] = useState("Sign up");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);

    const [error, setError] = useState('');
    // const [loginData, setLoginData] = useState({ email: '', password: '' });

    const {login} = useContext(AuthContext);


    const onSubmitHandler = (e) => {
        e.preventDefault();

        if(currState === "Sign up" && !isDataSubmitted){
            setIsDataSubmitted(true);
            return;  
        }

        login(currState === "Sign up" ? 'signup' : 'login', {fullName, email, password, bio});
        
    };

    return (
        <div className="flex justify-center items-center gap-8 h-screen bg-gradient-to-tr from-blue-300 to-purple-300">
            {/* ---------------left------------ */}
            <div className='flex flex-col items-center justify-center gap-2 text-gray-600 max-md:hidden'>
                <h1 className=' text-4xl font-extrabold tracking-wide'>Chattrix</h1>
                <p className='text-lg font-medium'>Chat Beyond Borders.</p>
            </div>
            {/* ---------------right------------ */}
            <form onSubmit={onSubmitHandler}>
            <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                <h2 className="text-2xl font-bold mb-6 text-center flex justify-between items-center">
                    {currState} to Chattrix
                    {isDataSubmitted && <img onClick={()=>{setIsDataSubmitted(false)}} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>}
                    
                </h2>

                
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                    {currState === "Sign up" && !isDataSubmitted && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                placeholder="Full Name"
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={(e)=>setFullName(e.target.value)}
                            />
                        </div>
                    )}
                    
                    {!isDataSubmitted && (
                        <>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                        </div>
                        </>
                    )}
                    
                    {currState === "Sign up" && isDataSubmitted && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1">Bio</label>
                            <textarea
                            rows={4}
                            placeholder='provide a short bio... '
                            className='w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400'
                            required
                            onChange={(e)=>setBio(e.target.value)}
                            ></textarea>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
                    >
                        {currState === "Sign up" ? "Create Account" : "Login"}
                    </button>
                
                
                <div>
                    {currState === "Sign up" ? (
                        <p className="text-sm text-center mt-4">
                            Already have an account?{' '}
                            <span onClick={()=>{setCurrState('Login'); setIsDataSubmitted(false)}} className="text-blue-600 font-medium hover:underline cursor-pointer">
                                Login
                            </span>
                        </p>
                    ) : (
                        <p className="text-sm text-center mt-4 ">
                            Don't have an account?{' '}
                            <span onClick={()=>{setCurrState("Sign up")}} className="text-blue-600 font-medium hover:underline cursor-pointer">
                                Sign up
                            </span>
                        </p>
                    )}
                </div>
                
            </div>
            </form>
        </div>
    );
}

export default Login;

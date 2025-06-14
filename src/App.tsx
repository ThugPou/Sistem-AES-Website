
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext.tsx';
import Register from './components/Register.tsx';
import Login from './components/Login.tsx';
import UserProfile from './components/UserProfile.tsx';
import Dashboard from './Pages/Dashboard.tsx'
import Home from './Pages/Home.tsx';
import AllCourses from './Pages/AllCourses.tsx';
import CourseDetail from './Pages/CourseDetail.tsx';
import EsaiDetail from './Pages/EsaiDetail.tsx';
import CourseSiswa from './Pages/CourseSiswa.tsx';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className= "bg-neutral">
                    <Routes>
                        {/* <Route path="/" element={<Home />} /> */}
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/allcourses" element={<AllCourses />} />
                        <Route path="/course/:id" element={<CourseDetail />} />
                        <Route path="/soal/:id" element={<EsaiDetail />} />
                        <Route path="/course/:id/esai/:esaiId/siswa" element={<CourseSiswa />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>

    );
};

export default App;
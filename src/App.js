// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import Profile from './components/Profile';

import Nav from './components/Nav';
import UserDetails from './components/Auth/UserDetails';
import SearchBar from './components/SearchBar';
import Matching from './components/Matching';
import Forum from './components/Forum';
import Discussion from './components/Discussion';
import Question from './components/Question';
import Resource from './components/Resource';
import Request from './components/Request';
import MentorRequests from './components/MentorRequests';
import Uresource from './components/Uresource';
import Chat from './components/Chat';
import TrackProgress from './components/TrackProgress';


function App() {
  return (
    <Router>
       <Routes>
       <Route  path="/" element={<Nav/>} ></Route>
        <Route  path="/signup" element={<SignUp/>} ></Route>
        <Route  path="/signin" element={<SignIn/>} ></Route>
        
        <Route  path="/landingpage" element={<LandingPage/>} ></Route>
        <Route  path="/nav" element={<Nav/>} ></Route>
        <Route  path="/userdetails" element={<UserDetails/>} ></Route>
        <Route  path="/match" element={<Matching/>} ></Route>
        
         <Route  path="/dashboard" element={<DashboardLayout/>} >
         <Route  path="requests" element={<MentorRequests/>} />
         <Route  path="search" element={<SearchBar/>} />
         <Route  path="resource" element={<Resource/>} />
         <Route  path="uresource" element={<Uresource/>} />
         <Route  path="Discussion" element={<Discussion/>} />
         <Route  path="forum" element={<Forum/>} />
         <Route  path="question" element={<Question/>} />
         <Route  path="profile" element={<Profile/>} />
         <Route  path="Request" element={<Request/>}  />
         <Route  path="track" element={<TrackProgress/>}  />
         <Route  path="chat" element={<Chat/>} />
         <Route  path="matching" element={<Matching/>} />

         </Route>
        </Routes>
    </Router>
  );
}

export default App;

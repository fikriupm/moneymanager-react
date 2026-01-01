import { SIDE_BAR_DATA } from '../assets/assets';
import  {AppContext} from '../context/AppContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';


const Sidebar = ({activeMenu}) => {
  const {user} = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="w-60 h-[calc(100vh-61px)] bg-blue-950 text-white p-5 sticky top-[61px] z-20 border-r border-blue-800/60">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img src={user?.profileImageUrl || ""} alt="profile image" className="w-20 h-20 bg-slate-400 rounded-full"/>
        ) : (
          <div className="w-25 h-25 rounded-full bg-white/50 border border-white flex items-center justify-center">
            <User className="w-18 h-18 text-3xl text-white" />
          </div>
        )}
        <h5 className="text-white font-medium leading-6 uppercase"> {user?.fullName || ""} </h5>
      </div>
      {SIDE_BAR_DATA.map((item, index) => (
        <button 
          onClick={() => navigate(item.path)}
          key={`menu_${index}`}
          className={`cursor-pointer w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-colors ${activeMenu == item.label ? "bg-white text-blue-800" : "text-white hover:bg-blue-700"}`}>
            <item.icon className="text-xl" />
            {item.label}
          </button>
      ))}

    </div>
  )
}
export default Sidebar;
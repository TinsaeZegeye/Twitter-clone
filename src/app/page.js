import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import Feed from "../../components/Feed";

export default function Home() {
return (
    <div>
        <main className="flex min-h-screen max-w-7xl mx-auto">
            {/* Sidebar Section */}
            <Sidebar/>
            
            {/* Feed Section */}
            <Feed/>
            
            {/* Widgets Section */}

            {/* Modal Section */}
        </main>        
    </div>
  );
}
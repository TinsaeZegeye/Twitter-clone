import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import Feed from "../../components/Feed";
import Widgets from "../../components/Widgets";
import { Newsreader } from "next/font/google";


export default async function Home({ newsResult }) {
    
    newsResult = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json').then((res) => res.json()); 

return (
    <div>
        <main className="flex min-h-screen mx-auto">
            {/* Sidebar Section */}
            <Sidebar/>
            
            {/* Feed Section */}
            <Feed/>
            
            {/* Widgets Section */}
            <Widgets articles={newsResult.articles} />

            {/* Modal Section */}
        </main>        
    </div>
  );
}

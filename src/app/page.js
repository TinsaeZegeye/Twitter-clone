import Sidebar from "../../components/Sidebar"
import Feed from "../../components/Feed"
import Widgets from "../../components/Widgets"

export default async function Home({ newsResult, randomUsersResult }) {
    
    newsResult = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/business/us.json').then((res) => res.json());

    randomUsersResult = await fetch('https://randomuser.me/api/?results=30&inc=name,login,picture').then((res) => res.json());

return (
    <div>
        <main className="flex min-h-screen mx-auto">
            {/* Sidebar Section */}
            <Sidebar/>
            
            {/* Feed Section */}
            <Feed/>
            
            {/* Widgets Section */}
            <Widgets articles={newsResult.articles} results={ randomUsersResult.results} />

            {/* Modal Section */}
        </main>        
    </div>
    );
}
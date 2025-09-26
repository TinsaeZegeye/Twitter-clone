import PostPage from "../../../../components/PostPage";

export default async function Page({ params }) {
    const id = await params.id;

    const newsResult = await fetch("https://saurav.tech/NewsAPI/top-headlines/category/business/us.json").then(res => res.json());
    const randomUsersResult = await fetch("https://randomuser.me/api/?results=30&inc=name,login,picture").then(res => res.json());

    return <PostPage postId={id} newsResult={newsResult} randomUsersResult={randomUsersResult} />;
}

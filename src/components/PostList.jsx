import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Postlist.css"
import ThemeToggle from "../components/toggle";

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/posts");
                const data = await res.json();
                setPosts(data);
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <p className="form-container">Cargando publicaciones...</p>;

    return (
        
        <div className="form-container">
            <h2 className="form-title">Posteos publicados</h2>

            {posts.map(post => (
                <div key={post.id} className="post-card">
                    <strong><h3 className="post-title">{post.title}:</h3></strong>
                    <h4 className="post-title"> {post.content}</h4>
                    <h5 className="post-title">Autor: {post.author}</h5>

                    <p className="post-date">
                         Creado el {new Date(post.date).toLocaleString()}
                    </p>

                    <button
                        className="form-button"
                        onClick={() => navigate(`/review/${post.id}`)}
                    >
                        Review
                    </button>
                </div>
            ))}
            
        </div>
    );
}

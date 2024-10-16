import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000/api/user/upload"); 

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://social-media-backend-eta-ten.vercel.app/api/admin/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    socket.on('userAdded', (newUser) => {
      setUsers((prevUsers) => [...prevUsers, newUser]);
    });

    return () => {
      socket.off('userAdded');
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>Admin User List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Social Media Handle</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.socialMediaHandle}</td>
              <td>
                {user.imageUrls && user.imageUrls.length > 0 ? (
                  user.imageUrls.map((image, index) => (
                    <img key={index} src={image} alt={`User Image ${index}`} style={{ width: '100px', marginRight: '10px' }} />
                  ))
                ) : (
                  <span>No images available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import "./myprofile.css";
import Button from "../../components/button/button";
const MyProfile = () => {
  return (
    <>
      <div className="myprofile-container">
        <h1 className="myprofile-title">Your profile</h1>
        <Button buttonplaceholder="Log out" buttonid="logout-button" />
      </div>
    </>
  );
};

export default MyProfile;

import React from "react";
import "./UserCard.scss";
import { TiLocationArrowOutline } from "react-icons/ti";

const UserCard: React.FC = () => {
  return (
    <div className="user-card">
      <div className="user-card__header">
        <div className="user-card__avatar">
          <img src="https://i.pravatar.cc/100" alt="User avatar" />
        </div>

        <div className="user-card__info">
          <h2 className="user-card__usertype">UserType</h2>
          <h1 className="user-card__name">Serban Robert-Stefan</h1>
        </div>
      </div>

      <div className="badge-toggle">
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">night theme enjoyer</span>
      </div>

      <div className="badge-iconic">
        <TiLocationArrowOutline className="icon" />
        <span className="badge-text">top 5% of event planners</span>
      </div>
    </div>
  );
};

export default UserCard;

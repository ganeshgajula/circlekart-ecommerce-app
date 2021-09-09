import React from "react";
import { useData } from "../../context/DataProvider";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import {
  isItemPresent,
  addProductToCart,
  addProductToWishlist,
  removeProductFromWishlist,
} from "../utils/utils";
import "../ProductsCard/ProductCard.css";

export const ProductCard = ({ ProductsList }) => {
  const {
    state: { itemsInWishlist, itemsInCart },
    dataDispatch,
  } = useData();

  const { userId, token } = useAuth();

  const addOrRemoveProductFromWishlist = (_id) =>
    isItemPresent(itemsInWishlist, _id)
      ? removeProductFromWishlist(_id, dataDispatch, userId)
      : addProductToWishlist(_id, dataDispatch, userId);

  return ProductsList.map(
    ({
      _id,
      name,
      image,
      price,
      productName,
      inStock,
      level,
      fastDelivery,
    }) => (
      <div
        key={_id}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          margin: "1rem",
          padding: "0.9rem",
          opacity: !inStock ? 0.6 : 1,
        }}
        className="card-with-dismiss card-vertical"
      >
        <Link to={`/product/${_id}`}>
          <img src={image} width="100%" height="auto" alt={productName} />
        </Link>
        {!inStock && (
          <span className="badge-item-sm removed-bdg bdg-card-position">
            Sold Out
          </span>
        )}
        <span className="close-btn-on-card">
          <svg
            width="1.3rem"
            height="1.3rem"
            viewBox="0 0 24 24"
            style={{
              fill: `${isItemPresent(itemsInWishlist, _id) ? "red" : "white"}`,
            }}
            onClick={() => addOrRemoveProductFromWishlist(_id)}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z"></path>
          </svg>
        </span>
        <div className="product-description-container">
          <div className="product-info">
            <Link
              to={`/product/${_id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h1 className="product-name"> {name} </h1>
            </Link>
            <p className="product-price-card-view">Rs. {price}</p>
          </div>
          <div className="product-availability-info">
            {inStock && <div className="stock-status"> In Stock </div>}
            {!inStock && <div className="stock-status"> Out of Stock </div>}
            <div className="level-info">{level}</div>
            {fastDelivery ? (
              <div className="delivery-status"> Fast Delivery </div>
            ) : (
              <div className="delivery-status"> 3 days minimum </div>
            )}
          </div>

          <div>
            {!isItemPresent(itemsInCart, _id) && (
              <button
                className="btn-outline btn-sm"
                onClick={() => {
                  addProductToCart(_id, dataDispatch, userId, token);
                }}
                disabled={!inStock ? true : false}
                style={{ cursor: !inStock ? "not-allowed" : "pointer" }}
              >
                Add to Cart
              </button>
            )}

            {isItemPresent(itemsInCart, _id) && (
              <Link to="/cart">
                <button className="btn-outline btn-sm">Go to Cart</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  );
};

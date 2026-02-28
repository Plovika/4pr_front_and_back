import React from "react";

export default function ProductItem({ product, onEdit, onDelete }) {
  return (
    <div className="userRow">
      <div className="userMain">
        <div className="userId">#{product.id}</div>
        <div className="userName">{product.name}</div>
        <div className="userAge">{product.category}</div>
        <div className="userCategory">{product.description}</div>
        <div className="userPrice">{product.price} ₽</div>
        <div className="userStock">На складе: {product.stock}</div>
      </div>
      <div className="userActions">
        <button className="btn" onClick={() => onEdit(product)}>
          Редактировать
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
}

package com.food.delivery.model;

public enum PaymentMethod {
    COD("Cash on Delivery"),
    CARD("Credit/Debit Card"),
    UPI("UPI Payment");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

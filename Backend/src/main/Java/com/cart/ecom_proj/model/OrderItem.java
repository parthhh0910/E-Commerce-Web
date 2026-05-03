package com.cart.ecom_proj.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    // We store denormalized product data so historical orders don't break if product is deleted
    private Long productId;
    private String productName;
    private String productBrand;
    private BigDecimal priceAtPurchase;
    private int quantity;
    private String productImageUrl; // optional, helps frontend display history easily
}

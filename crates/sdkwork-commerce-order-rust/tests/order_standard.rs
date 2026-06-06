use sdkwork_commerce_core::CommerceMoney;
use sdkwork_commerce_order::{
    OrderAmountBreakdown, OrderItemDraft, OrderStatus, OrderTransition, PaidOrderReference,
};

#[test]
fn computes_order_payable_amount_from_items_and_discount() {
    let item =
        OrderItemDraft::new("sku-1", "Pro plan", 2, CommerceMoney::new("10.00").unwrap()).unwrap();
    let breakdown =
        OrderAmountBreakdown::from_items(vec![item], CommerceMoney::new("3.00").unwrap()).unwrap();

    assert_eq!(breakdown.original_amount.as_str(), "20.00");
    assert_eq!(breakdown.discount_amount.as_str(), "3.00");
    assert_eq!(breakdown.payable_amount.as_str(), "17.00");
}

#[test]
fn rejects_order_amount_overflow_instead_of_panicking_or_zeroing() {
    let item = OrderItemDraft::new(
        "sku-huge",
        "Huge plan",
        1,
        CommerceMoney::new("92233720368547758.08").unwrap(),
    )
    .unwrap();

    assert!(
        OrderAmountBreakdown::from_items(vec![item], CommerceMoney::new("0").unwrap()).is_err()
    );
}

#[test]
fn rejects_order_line_total_overflow() {
    let item = OrderItemDraft::new(
        "sku-many",
        "Many seats",
        u32::MAX,
        CommerceMoney::new("21474836.49").unwrap(),
    )
    .unwrap();

    assert!(
        OrderAmountBreakdown::from_items(vec![item], CommerceMoney::new("0").unwrap()).is_err()
    );
}

#[test]
fn validates_order_status_lifecycle() {
    assert_eq!(
        OrderTransition::new(OrderStatus::PendingPayment, OrderStatus::Paid).validate(),
        Ok(())
    );
    assert!(
        OrderTransition::new(OrderStatus::Completed, OrderStatus::Paid)
            .validate()
            .is_err()
    );
}

#[test]
fn only_pending_payment_orders_can_be_cancelled_or_expired() {
    assert!(OrderStatus::PendingPayment.can_cancel());
    assert!(OrderStatus::PendingPayment.can_expire());
    assert!(!OrderStatus::Paid.can_cancel());
}

#[test]
fn paid_order_reference_requires_payment_id_before_invoice_linking() {
    let reference = PaidOrderReference::new("order-1", "payment-1").unwrap();

    assert_eq!(reference.order_id, "order-1");
    assert_eq!(reference.payment_id, "payment-1");
    assert!(PaidOrderReference::new("order-1", "").is_err());
}

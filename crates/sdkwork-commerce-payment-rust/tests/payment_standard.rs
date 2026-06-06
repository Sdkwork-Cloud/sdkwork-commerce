use sdkwork_commerce_core::{CommerceMoney, CommerceServiceError};
use sdkwork_commerce_payment::{
    PaymentIntentDraft, PaymentProviderCommand, PaymentProviderPortRequirement, PaymentStatus,
    PaymentTransition, RefundStatus, RefundTransition,
};

#[test]
fn creates_payment_intent_with_provider_and_order_reference() {
    let intent = PaymentIntentDraft::new(
        "tenant-1",
        "order-1",
        "wechat",
        CommerceMoney::new("19.90").unwrap(),
        "idem-1",
    )
    .unwrap();

    assert_eq!(intent.order_id, "order-1");
    assert_eq!(intent.provider, "wechat");
    assert_eq!(intent.amount.as_str(), "19.90");
}

#[test]
fn validates_payment_status_lifecycle() {
    assert_eq!(
        PaymentTransition::new(PaymentStatus::Created, PaymentStatus::Pending).validate(),
        Ok(())
    );
    assert_eq!(
        PaymentTransition::new(PaymentStatus::Succeeded, PaymentStatus::Pending).validate(),
        Err(CommerceServiceError::invalid_state(
            "invalid payment status transition"
        ))
    );
}

#[test]
fn validates_refund_status_lifecycle() {
    assert_eq!(
        RefundTransition::new(RefundStatus::Requested, RefundStatus::Processing).validate(),
        Ok(())
    );
    assert!(
        RefundTransition::new(RefundStatus::Succeeded, RefundStatus::Processing)
            .validate()
            .is_err()
    );
}

#[test]
fn payment_provider_contract_exposes_required_commands() {
    assert_eq!(
        PaymentProviderPortRequirement::standard_commands(),
        vec![
            PaymentProviderCommand::CreatePaymentIntent,
            PaymentProviderCommand::QueryPaymentStatus,
            PaymentProviderCommand::ClosePayment,
            PaymentProviderCommand::Refund,
            PaymentProviderCommand::VerifyWebhook,
        ],
    );
}

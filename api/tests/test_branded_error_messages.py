import pytest

from api.constants import PRODUCT_NAME, product_internal_error_message
from api.errors.mps import mps_unavailable_public_message


def test_mps_unavailable_message_uses_product_name(monkeypatch):
    monkeypatch.setattr("api.constants.PRODUCT_NAME", "Acme")
    monkeypatch.setattr("api.errors.mps.PRODUCT_NAME", "Acme")

    assert mps_unavailable_public_message() == (
        "A Acme service is temporarily unavailable. Please try again later."
    )


def test_product_internal_error_message_uses_product_name(monkeypatch):
    monkeypatch.setattr("api.constants.PRODUCT_NAME", "Acme")

    assert product_internal_error_message("telephony") == (
        "Acme encountered an internal error while processing telephony."
    )


def test_default_product_name_is_val():
    assert PRODUCT_NAME == "Val"

"""Errors raised at the Model Proxy Service boundary."""

from api.constants import PRODUCT_NAME


def mps_unavailable_public_message() -> str:
    return (
        f"A {PRODUCT_NAME} service is temporarily unavailable. "
        "Please try again later."
    )


MPS_UNAVAILABLE_PUBLIC_MESSAGE = mps_unavailable_public_message()


class MPSUnavailableError(ConnectionError):
    """MPS could not complete an operation for a Dograh-owned reason.

    ``status_code`` is retained as structured classifier input. Response bodies are
    deliberately excluded because upstream payloads may contain sensitive details.
    """

    def __init__(self, operation: str, *, status_code: int | None = None) -> None:
        self.operation = operation
        self.status_code = status_code
        detail = f"MPS could not complete {operation}"
        if status_code is not None:
            detail = f"{detail} (HTTP {status_code})"
        super().__init__(detail)

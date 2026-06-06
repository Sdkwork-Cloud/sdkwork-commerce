pub(crate) use sdkwork_http_context::{
    resolve_request_id, with_server_request_identity as with_request_identity,
};

#[cfg(test)]
pub(crate) use sdkwork_http_context::REQUEST_ID_HEADER;

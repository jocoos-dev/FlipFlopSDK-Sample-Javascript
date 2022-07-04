export function isWebRTCSupported() {
  return navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      window.RTCPeerConnection;
}

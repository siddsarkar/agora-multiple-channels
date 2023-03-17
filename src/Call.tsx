import AgoraRTC from "agora-rtc-sdk-ng";
import React, { useEffect, useState } from "react";
import "./Call.css";
import { AGORA_APP_ID } from "./agora.config";
import MediaPlayer from "./components/MediaPlayer";
import useAgora from "./hooks/useAgora";

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

function Call() {
	// const [appid, setAppid] = useState(AGORA_APP_ID);
	// const [token, setToken] = useState("");

	const appid = AGORA_APP_ID;
	const token = "";

	const [channel, setChannel] = useState("");
	const {
		localAudioTrack,
		localVideoTrack,
		joinState,
		leave,
		join,
		remoteUsers,
	} = useAgora(client);

	const [audioMuted, setAudioMuted] = useState(false);
	const [videoMuted, setVideoMuted] = useState(false);

	useEffect(() => {
		if (localAudioTrack) {
			localAudioTrack.setMuted(audioMuted);
		}
	}, [audioMuted, localAudioTrack]);

	useEffect(() => {
		if (localVideoTrack) {
			localVideoTrack.setMuted(videoMuted);
		}
	}, [videoMuted, localVideoTrack]);

	const searchParams = new URLSearchParams(window.location.search);
	const urlChannel = searchParams.get("channel");

	useEffect(() => {
		if (urlChannel) {
			setChannel(urlChannel);
			join(appid, urlChannel, token);
		}

		return () => {
			leave();
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className="call">
			<form className="call-form">
				{/* <label>
					AppID:
					<input
						type="text"
						name="appid"
						onChange={(event) => {
							setAppid(event.target.value);
						}}
					/>
				</label> */}
				{/* <label>
					Token(Optional):
					<input
						type="text"
						name="token"
						onChange={(event) => {
							setToken(event.target.value);
						}}
					/>
				</label> */}
				<p>
					{appid === "" &&
						"App id not provided!! add your appId in agora.config.ts file"}
				</p>
				<label>
					Channel Name:{" "}
					<input
						type="text"
						name="channel"
						disabled={joinState}
						onChange={(event) => {
							setChannel(event.target.value);
						}}
					/>
				</label>
				<button
					id="join"
					type="button"
					className="btn btn-primary btn-sm"
					disabled={joinState}
					onClick={() => {
						window.location.href =
							window.location.origin + "?channel=" + channel;
					}}
				>
					Create
				</button>
				{joinState && (
					<p>
						Meeting Link:{" "}
						<a
							target="_blank"
							rel="noreferrer"
							href={window.location.origin + "?channel=" + channel}
						>
							{window.location.origin + "?channel=" + channel}
						</a>
					</p>
				)}

				<div className="button-group">
					<button
						id="leave"
						type="button"
						className="btn btn-primary btn-sm"
						disabled={!joinState}
						onClick={() => {
							leave();
						}}
					>
						Leave
					</button>
				</div>
			</form>
			<div className="player-container">
				<div className="local-player-wrapper">
					<p className="local-player-text">
						{localVideoTrack && `localTrack`}
						{localVideoTrack ? ` (uid=${client.uid})` : ""}
					</p>
					<MediaPlayer
						videoTrack={localVideoTrack}
						audioTrack={undefined}
					></MediaPlayer>
					<p className="local-player-text">
						{joinState && (
							<>
								<button
									type="button"
									className="btn btn-primary btn-sm"
									onClick={() => {
										setAudioMuted(!audioMuted);
									}}
								>
									{audioMuted ? "Unmute" : "Mute"} Audio
								</button>
								<button
									type="button"
									className="btn btn-primary btn-sm"
									onClick={() => {
										setVideoMuted(!videoMuted);
									}}
								>
									{videoMuted ? "Unmute" : "Mute"} Video
								</button>
							</>
						)}
					</p>
				</div>
				{remoteUsers.map((user) => (
					<div className="remote-player-wrapper" key={user.uid}>
						<p className="remote-player-text">{`remoteVideo (uid=${user.uid})`}</p>
						<MediaPlayer
							videoTrack={user.videoTrack}
							audioTrack={user.audioTrack}
						></MediaPlayer>
					</div>
				))}
			</div>
		</div>
	);
}

export default Call;

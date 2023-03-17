import {
	ILocalAudioTrack,
	ILocalVideoTrack,
	IRemoteAudioTrack,
	IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import React, { useEffect, useRef } from "react";

export interface VideoPlayerProps {
	videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
	audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
}

const MediaPlayer = (props: VideoPlayerProps) => {
	const container = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!container.current) return;
		props.videoTrack?.play(container.current);
		return () => {
			props.videoTrack?.stop();
		};
	}, [container, props.videoTrack]);
	useEffect(() => {
		if (props.audioTrack) {
			props.audioTrack?.play();
		}
		return () => {
			props.audioTrack?.stop();
		};
	}, [props.audioTrack]);
	return (
		<div
			ref={container}
			className="video-player"
			style={{ width: "320px", height: "240px" }}
		></div>
	);
};

export default MediaPlayer;

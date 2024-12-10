export class VideoSDK {
    SDK(): {
        __internal: {
            parseId: (offer: string, answer: string) => { sessionId: string; };
        };
        pc: RTCPeerConnection;
        play: (url: string, options: { videoOnly?: boolean; audioOnly?: boolean; }) => Promise<{ sessionId: string; }>;
        close: () => void;
        ontrack: (event: RTCTrackEvent) => void;
    } {
        const self: {
            __internal: {
                parseId: (offer: string, answer: string) => { sessionId: string; };
            };
            pc: RTCPeerConnection;
            play: (url: string, options: { videoOnly?: boolean; audioOnly?: boolean; }) => Promise<{ sessionId: string; }>;
            close: () => void;
            ontrack: (event: RTCTrackEvent) => void;
            stream: MediaStream
        } = {
            __internal: {
                parseId: (offer, answer) => {
                    let sessionId = offer.substr(offer.indexOf('a=ice-ufrag:') + 'a=ice-ufrag:'.length);
                    sessionId = sessionId.substr(0, sessionId.indexOf('\n') - 1) + ':';
                    sessionId += answer.substr(answer.indexOf('a=ice-ufrag:') + 'a=ice-ufrag:'.length);
                    sessionId = sessionId.substr(0, sessionId.indexOf('\n'));
                    return { sessionId };
                },
            },
            pc: new window.RTCPeerConnection(),
            stream: new window.MediaStream(),
            play: async function (url, options) {
                if (options?.videoOnly && options?.audioOnly) throw new Error(`video and audio not`);
                if (!options?.videoOnly) self.pc.addTransceiver("audio", { direction: "recvonly" });
                if (!options?.audioOnly) self.pc.addTransceiver("video", { direction: "recvonly" });
                const offer = await self.pc.createOffer();
                await self.pc.setLocalDescription(offer);

                // const response = await fetch(url, {
                //     method: 'POST',
                //     headers: {
                //         'Content-type': 'application/sdp'
                //     },
                //     body: offer.sdp
                // });

                const sessionid = Math.random().toString().substr(2, 22)
                const response = await fetch('https://kx-stream.eijdjs.cn/webrtc/v1/pullstream', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/sdp'
                    },
                    body: JSON.stringify(
                        {
                            clientinfo: "Windows NT 10.0;Chrome 131.0.0.0",
                            localsdp: {
                                sdp: offer.sdp,
                                type: "offer",

                            },
                            sessionid,
                            streamurl: "webrtc://kx-stream.eijdjs.cn/live112/720p?txSecret=39ea7e06fc1185c3e62e6259e6004196&txTime=675955ef"
                        }
                    )
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }

                const responseText = await response.text();
                const responseJSON = JSON.parse(responseText);
                console.log(responseJSON)
                await self.pc.setRemoteDescription(
                    new RTCSessionDescription({
                        type: 'answer', sdp: responseJSON.remotesdp.sdp
                    })
                );

                return self.__internal.parseId(offer.sdp, responseJSON.remotesdp.sdp);
            },
            close: function () {
                self.pc && self.pc.close();
                self.pc = null;
            },
            ontrack: function (event) {
                console.log('ontrack : ', event);

                self.stream.addTrack(event.track);
            }
        };

        self.pc.ontrack = function (event) {
            if (self.ontrack) {
                self.ontrack(event)
            }
        }

        return self;
    }
}

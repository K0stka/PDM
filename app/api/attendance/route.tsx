import {
    Document,
    Font,
    Image as PDFImage,
    Page,
    StyleSheet,
    Text,
    View,
    renderToStream,
} from "@react-pdf/renderer";
import { events as Events, db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, createMapById } from "@/lib/utils";
import { session, validateUser } from "@/auth/session";

import { getBlockName } from "@/validation/block";

export async function GET(req: NextRequest) {
    const user = await session();

    if (!validateUser(user, { isAdmin: true }))
        return NextResponse.json(UnauthorizedError());

    const blocks = createMapById(await db.query.blocks.findMany(), "id");

    const archetypes = createMapById(
        await db.query.archetypes.findMany({
            columns: {
                id: true,
                name: true,
            },
        }),
        "id",
    );

    const places = createMapById(await db.query.places.findMany(), "id");

    const events = await db.query.events.findMany({
        with: {
            attendances: {
                columns: {},
                with: {
                    user: {
                        columns: {
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: [Events.archetype, Events.block],
    });

    Font.register({
        family: "Roboto",
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
    });

    Font.register({
        family: "RobotoBold",
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-semibold-webfont.ttf",
    });

    const styles = StyleSheet.create({
        page: {
            padding: 20,
            fontFamily: "Roboto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
            gap: 20,
        },
        header: {
            display: "flex",
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
        },
        headerImage: {
            width: 50,
            height: 50,
        },
        headerText: {
            display: "flex",
            flexDirection: "column",
            gap: 5,
        },
        headerTitle: {
            fontFamily: "RobotoBold",
            fontSize: 16,
            display: "flex",
            flexDirection: "row",
            gap: "0 5px",
            flexWrap: "wrap",
        },
        headerInfo: {
            display: "flex",
            flexDirection: "row",
            gap: 10,
            fontSize: 10,
        },
        footer: {
            fontSize: 10,
            color: "#999999",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        table: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            // height: "100%",
            // width: "100%",
            marginBottom: "auto",
            gap: "0 2%",
            fontSize: 10,
        },
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 5,
            width: "49%",
        },
        signatureSpace: {
            width: 150,
            height: 20,
            borderBottom: "1px dotted black",
            flexShrink: 1,
        },
    });

    const stream = await renderToStream(
        <Document author="Studentská rada GH" title="Seznam účastníků">
            {events.map((event) => (
                <Page size="A4" style={styles.page}>
                    <View style={styles.header} fixed>
                        <PDFImage
                            src={
                                "https://prednaskovy-den.krychlic.com/icons/icon-512.png"
                            }
                            style={styles.headerImage}
                        />
                        <View style={styles.headerText}>
                            <View style={styles.headerTitle}>
                                {archetypes
                                    .get(event.archetype)!
                                    .name.split(" ")
                                    .map((t) => (
                                        <Text>{t}</Text>
                                    ))}
                            </View>
                            <View style={styles.headerInfo}>
                                <Text>
                                    Blok:{" "}
                                    {getBlockName(blocks.get(event.block)!)}
                                </Text>
                                <Text>
                                    Učebna: {places.get(event.place)!.name}
                                </Text>
                                <Text>
                                    Účastníků: {event.attending} /{" "}
                                    {event.capacity}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.table}>
                        {event.attendances
                            .map((a) => a.user.name)
                            .sort()
                            .map((name) => (
                                <>
                                    <View style={styles.row}>
                                        <Text style={{ flexShrink: 0 }}>
                                            {name}
                                        </Text>
                                        <View
                                            style={styles.signatureSpace}
                                        ></View>
                                    </View>
                                </>
                            ))}
                        {[0, 1].map(() => (
                            <View style={styles.row}>
                                <Text
                                    style={{
                                        ...styles.signatureSpace,
                                        borderColor: "#aaaaaa",
                                    }}
                                ></Text>
                                <View
                                    style={{
                                        ...styles.signatureSpace,
                                        borderColor: "#aaaaaa",
                                    }}
                                ></View>
                            </View>
                        ))}
                    </View>
                    <View
                        style={{
                            ...styles.row,
                            fontSize: 10,
                            width: "100%",
                            gap: 20,
                        }}
                    >
                        <Text>Doprovod:</Text>{" "}
                        <View
                            style={{ ...styles.signatureSpace, width: "100%" }}
                        ></View>
                    </View>
                    <View style={styles.footer} fixed>
                        <Text style={{ flexBasis: "80%" }}>
                            ID dokumentu: {event.id}_{Date.now()}
                        </Text>
                        <Text
                            style={{ flexBasis: "100%", textAlign: "center" }}
                        >
                            Přednáškový den Studentské rady GH, 2025
                        </Text>
                        <Text
                            style={{ flexBasis: "80%", textAlign: "right" }}
                            render={({ subPageNumber, subPageTotalPages }) =>
                                `Strana ${subPageNumber} z ${subPageTotalPages}`
                            }
                        />
                    </View>
                </Page>
            ))}
        </Document>,
    );

    return new NextResponse(stream as unknown as ReadableStream);
}

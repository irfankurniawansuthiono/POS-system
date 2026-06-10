export default function getUniquePrismaField({ text }: { text: string }) {
    const splitText = text.match(/\(`"?(\w+)"?`\)/);
    return splitText?.[1];
}
